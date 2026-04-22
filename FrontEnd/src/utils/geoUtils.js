import axios from 'axios';

export const fetchLocationData = async () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject("Geolocation is not supported by your browser.");
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
                );
                const address = response.data.address;
                resolve({
                    city: address.city || address.town || address.governorate || "Unknown City",
                    area: address.suburb || address.neighbourhood || address.county || "Unknown Area",
                    street: address.road || "Street not detected",
                    lat: latitude,
                    lng: longitude
                });
            } catch (error) {
                console.log(error.messages);
                reject("Failed to retrieve address details from the server.");
            }
        }, (error) => {
            const messages = {
                1: "Permission denied. Please enable location access in your browser.",
                2: "Position unavailable. Network issue or GPS signal lost.",
                3: "Request timed out. Please try again."
            };
            reject(messages[error.code] || "An unknown error occurred.");
        });
    });
};