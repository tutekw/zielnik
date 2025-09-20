import AsyncStorage from '@react-native-async-storage/async-storage';

async function getValue (key :string) {
    try {
        return await AsyncStorage.getItem(key);
    }
    catch(e)
    {
        console.error(e);
    }
};

async function getObject (key :string) {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    }
    catch(e) {
        console.error(e);
    }
};

async function setValue (key :string, value :string) {
    try {
        await AsyncStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
};

async function setObject (key :string, value :any)  {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(e);
    }
};

async function remove (key :string) {
    try {
        await AsyncStorage.removeItem(key);
    }
    catch (e) {
        console.error(e);
    }
};

export default { getValue, getObject, setValue, setObject, remove};