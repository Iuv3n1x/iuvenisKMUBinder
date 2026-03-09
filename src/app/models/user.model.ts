export interface User {
    firstname: string;
    lastname: string;
    email: string;
    passwordhash: string;
    registrationdate: Date;
    birthdate: Date;
}

export interface UserLog {
    email: string;
    password: string;
}