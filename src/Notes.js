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
                note.filename = note.image
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
        <div class="cointainer">
            <h1>Create note</h1>
            <div class="form-group">
                <input
                    onChange={e => setFormData({ ...formData, 'name': e.target.value })}
                    placeholder="Product name"
                    value={formData.name}
                />
            </div>
            <div class="form-group">
                <input
                    onChange={e => setFormData({ ...formData, 'description': e.target.value })}
                    placeholder="Product count"
                    value={formData.description}
                />
            </div>
            <div class="form-group">
            <label class="btn btn-default">
                <input type="file" onChange={onChange} />
            </label>
            </div>
            <div class="form-group">
                <button class="btn btn-success" onClick={createNote}>Add</button>
            </div>
            <div class="jumbotron" >
            <h2>Products:</h2>
            </div>
                {
                    notes.map(note => (
                        <div class="jumbotron" style={{ marginBottom: 30 }}>
                            {
                                note.image && <img src={note.image}  style={{width: 300}} />
                            }
                            <div class="card-body">
                                <div key={note.id || note.name}>
                                    <h3>{note.name}</h3>
                                    <p class="card-text">{note.description}</p>
                                    <button class="btn btn-danger" onClick={() => deleteNote(note, note.filename)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        
    )
}