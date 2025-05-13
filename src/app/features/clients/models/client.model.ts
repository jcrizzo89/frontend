export interface Client {
    id?: string;
    name: string;
    phone: string;
    address: string;
    mapLink?: string;
    observations?: string;
    zone: string;
    bottleType: string;
    type: string;
    registrationDate: Date;
    photo?: string;
}
