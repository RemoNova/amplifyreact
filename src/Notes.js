import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

export default function Notes() {

    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    async function fetchNotes() {
        const apiData = await API.graphql({ query: listNotes });
        const notesFromAPI = apiData.data.listNotes.items;
        await Promise.all(notesFromAPI.map(async note => {
            if (note.image) {
                const image = await Storage.get(note.image);
                note.image = image;
            }
            return note;
        }))
        setNotes(apiData.data.listNotes.items);
    }

    async function createNote() {
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createNoteMutation, variables: { input: formData } });
        if (formData.image) {
            const image = await Storage.get(formData.image);
            formData.image = image;
        }
        setNotes([...notes, formData]);
        setFormData(initialFormState);
    }

    async function deleteNote({ id, image }) {
        const newNotesArray = notes.filter(note => note.id !== id);
        setNotes(newNotesArray);
        await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } });
        if (image) {
            await Storage.remove(image);
        }
    }

    async function onChange(e) {
        if (!e.target.files[0]) return
        const file = e.target.files[0];
        setFormData({ ...formData, image: file.name });
        await Storage.put(file.name, file);
    }

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div class="jumbotron">
            <h1>Create note</h1>
            <div class="form-group">
                <input
                    onChange={e => setFormData({ ...formData, 'name': e.target.value })}
                    placeholder="Note name"
                    value={formData.name}
                />
            </div>
            <div class="form-group">
                <input
                    onChange={e => setFormData({ ...formData, 'description': e.target.value })}
                    placeholder="Note description"
                    value={formData.description}
                />
            </div>
            <label class="btn btn-default">
                Browse <input type="file" onChange={onChange} />
            </label>
            <div class="form-group">
                <button class="btn btn-success" onClick={createNote}>Create Note</button>
            </div>
            <div style={{ marginBottom: 30 }}>
                <h1>My notes:</h1>
                {
                    notes.map(note => (
                        <div class="form-group">
                            <div key={note.id || note.name}>
                                <h2>{note.name}</h2>
                                <p>{note.description}</p>
                                <div class="form-group">
                                    <button onClick={() => deleteNote(note, note.image)}>Delete note</button>
                                    {
                                        note.image && <img src={note.image} style={{ width: 400 }} />
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}