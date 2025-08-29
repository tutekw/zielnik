import storage from './storage';
import axios from 'axios';

async function getUser() {
    var loggedIn = await storage.getObject("logged_in");
    if(!loggedIn){ 
        return undefined;
    }

    const token = await storage.getValue("token");
    if(!token){ 
        await storage.remove("user");
        await storage.setObject("logged_in", false);
        return undefined;
    }

    try{
        const response = await axios.post("http://localhost:5050/api/auth/token", null,
        {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch(err) {
        await storage.remove("token");
        await storage.remove("user");
        await storage.setObject("logged_in", false);
        throw new Error(JSON.stringify(err));
    }

    var user = await storage.getObject("user");
    if(user) {
        return user;
    }

    try {
        const response = await axios.get("http://localhost:5050/api/user/",
        {
            headers: { Authorization: `Bearer ${token}` }
        });
        if(response.status == 200) {
            const user = {
                ...response.data,
                address: response.data.address ?? {}
            };
            await storage.setObject("user", user);
            return user;
        }
    } catch (err) {
        throw new Error(JSON.stringify(err));
    }
}

export default { getUser }