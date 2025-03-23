import { ADJ } from "../types/ADJ";

const BASE_PATH = 'http://localhost:8000';

export const sendADJPath = async (adjPath: string) => {
    if (!adjPath) {
        throw new Error("You must introduce a valid ADJ path.");
    }

    const url = `${BASE_PATH}/path`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ 
                path: adjPath
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Query error: ${response.status} ${response.statusText}.`);
        }

    } catch (error) {
        console.error("Query error:", error);
        throw error;
    }
};

export const assembleJSON = async () => {

    const url = `${BASE_PATH}/assemble`;

    try {
        const response = await fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`Query error: ${response.status} ${response.statusText}.`);
        }

        return await response.json();

    } catch(error) {
        console.error("Query error:", error);
        throw error;
    }
}

export const sendADJ = async (adj: ADJ) => {

    const url = `${BASE_PATH}/update`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(adj),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`Query error: ${response.status} ${response.statusText}.`);
        }
    } catch(error) {
        console.error("Query error:", error)
        throw error;
    }

}