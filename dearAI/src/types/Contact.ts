export interface Contact {
    id: string;
    name: string;
    email: string;
    group?: string;
    time_modified?: string;
}

export interface ContactApiResponse {
    id: string;
    recipient_name: string;
    email: string;
    recipient_group?: string;
    time_modified?: string;
}
