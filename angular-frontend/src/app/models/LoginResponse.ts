


export default interface LoginResponse {
    message: 'Login successful!',
    token: string, 
    user: {
        id: string,
        username: string,
        email: string,
        role: string,
    }
}