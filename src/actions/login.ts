
export default async function login(formData: FormData) {
    const user = formData.get('user') as string;
    const password = formData.get('password') as string;

    if (user === 'admin' && password === 'admin') {
        return { status: 200, body: 'Welcome admin' };
    } else {
        return { status: 401, body: 'Unauthorized' };
    }
}
