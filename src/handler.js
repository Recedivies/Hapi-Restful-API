/* eslint-disable require-jsdoc */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    const id = nanoid(16);

    const finished = pageCount === readPage;

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading,
        insertedAt, updatedAt,
    };
    books.push(newBook);    

    const idx = books.findIndex((book) => book.id === id);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (name === undefined) {
        books.splice(idx, 1);
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        books.splice(idx, 1);
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    } else if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }, 
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

function search(s, name) {
    s = s.toLowerCase();
    name = name.toLowerCase();
    let ret = '';
    let j = 0;
    for (let i = 0; i < name.length; i++) {
        if (s[j] === name[i]) {
            ret += s[j];
            if (ret === s) {
                break;
            }
            j++;
        } else {
            ret = '';
            j = 0;
        }
    }
    if (ret === s) {
        return true;
    }
    return false;
}

const getAllBooks = (request, h) => {
    const { name, reading, finished } = request.query;
    let tmp;
    if (name) {
        tmp = books.filter((book) => search(name, book.name) === true);
    } else if (reading == 1) {
        tmp = books.filter((book) => book.reading === true);
    } else if (reading == 0) {
        tmp = books.filter((book) => book.reading === false);
    } else if (finished == 1) {
        tmp = books.filter((book) => book.finished === true);
    } else if (finished == 0) {
        tmp = books.filter((book) => book.finished === false);
    } else {
        tmp = books;
    }
    const response = h.response({
        status: 'success',
        data: {
            books: tmp.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,

            })),
        },
    });
    response.code(200);
    return response;
};

const getBooksById = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const updateBookById = (request, h) => {    
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const idx = books.findIndex((book) => book.id === bookId);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    } else if (idx === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
    books[idx] = {
        ...books[idx],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    };
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};

const deleteBooksById = (request, h) => {
    const { bookId } = request.params;

    const idx = books.findIndex((book) => book.id === bookId);

    if (idx === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
    books.splice(idx, 1);
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
};

module.exports = { addBook, getAllBooks, getBooksById, updateBookById, deleteBooksById };