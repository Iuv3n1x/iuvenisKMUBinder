export interface Admin {
    firstname: string;
    lastname: string;
    companyName: string;
    starterCode: string;
    email: string;
    passwordhash: string;
    registrationdate: Date;
    birthdate: Date;
    seriesLimit: number;
}

export interface AdminLog {
    email: string;
    password: string;
}
