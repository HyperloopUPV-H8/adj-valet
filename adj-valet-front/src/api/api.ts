const BASE_PATH = 'http://localhost:3000';

export const sendADJPath = async (adjPath: string) => {
    if (!adjPath) {
        throw new Error("El parámetro 'adjPath' es obligatorio.");
    }

    const url = `${BASE_PATH}/path`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ adjPath }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        return await response.json(); // Si esperas un JSON como respuesta
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        throw error; // Re-lanzar el error para que el llamador lo maneje
    }
};