export default function handleResponseError(error :any, message400? :string) {
    console.error('Error:', error);
    if(error.response) {
        const status = error.response.status;
        if(status === 400) {
            return message400;
        }
        if(status === 500) {
            return('Server error. Please try again later.');
        } 
        else if(status === 429) {
            return('Too many requests. Please try again later.')
        }
        else {
            return(`Unexpected error (${status}).`);
        }
    }
    else if(error.request) {
        //Brak odpowiedzi z serwera
        return('No response from server. Are you online?');
    } 
    else {
        //Coś innego poszło nie tak
        return('An unexpected error occurred.');
    }
}