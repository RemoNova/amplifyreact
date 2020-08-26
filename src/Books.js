import React from 'react'
import Book from './Book'


const bookList = [
    {title: 'The first'}, {title: 'The second'}
]

export default function Books() {
    var tries = 0

    const [showBook, setShow] = React.useState(false);

    React.useEffect(() => {
        console.log("show book changed")
    }, [showBook])

    return (
        <div>
            {showBook && bookList.map(book => <Book title={book.title}/>)}
            <button onClick={() => {
                tries++;
                if (tries >= 3) {
                    setShow(true)
                }
            }
              
            }>
                Show books
            </button>
        </div>
    )
}