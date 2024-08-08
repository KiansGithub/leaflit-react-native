const mockAxios = {
    create: jest.fn(() => mockAxios),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
        request: {
            use: jest.fn(),
        },
        response: {
            use: jest.fn(),
        },
    },
};

export default mockAxios;