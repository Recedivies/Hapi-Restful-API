const { 
    addBook,
    getAllBooks,
    getBooksById,
    updateBookById,
    deleteBooksById,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBook,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBooksById,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookById,
    },
    {   
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBooksById,
    },
];
module.exports = routes;