export interface Packet {
    id: number,
    type: string,
    name: string,
    variables: { [key: string]: string }[]
}