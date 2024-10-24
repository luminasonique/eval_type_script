type UserProps = {
    id: string
    email: string
    password: string
}

export class User {
    email(email: any) {
        throw new Error('Method not implemented.')
    }
    constructor(public props: UserProps) {}
}