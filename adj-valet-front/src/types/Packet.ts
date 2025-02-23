export type Packet = {
    type: string;
    name: string;
    variables: Record<string, string>[];
};