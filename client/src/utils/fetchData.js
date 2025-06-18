export default async function fetchData(url, formData, type, token) {
    if (type == "SIGNIN") {
        let base64String;

        if (typeof formData.img == "string") {
            base64String = formData.img
        } else if (typeof formData.img == "object") {
            const file = formData.img;
            const toBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
            base64String = await toBase64(file);
        }

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ blobImg: base64String, ...formData }),
            credentials: "include"
        });

        return res;
    } else if (type == "UPDATE") {
        let base64String;

        if (typeof formData?.img[0]?.url == "string") {
            base64String = formData?.img[0]?.url;
        } else if (typeof formData?.img == "object") {
            const file = formData.img;
            const toBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
            base64String = await toBase64(file);
        }

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ blobImg: base64String, ...formData }),
            credentials: "include",
            headers: {
                'Authorization': `${token}`,
            },
        });

        return res;
    } else if (type == "LOGIN") {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ ...formData }),
            credentials: "include"
        });

        return res;
    } else if (type == "CHANGEPASS") {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ ...formData }),
            headers: {
                'Authorization': `${token}`,
            },
            credentials: "include"
        });

        return res;
    } else if (type == "UPLOADIMG") {
        let base64String;

        if (typeof formData == "string") {
            base64String = formData
        } else if (typeof formData == "object") {
            const file = formData[0]?formData[0]:formData;
            console.log(formData);
            console.log(file);
            const toBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
            base64String = await toBase64(file);
        }

        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ blobImg: base64String }),
            headers: {
                'Authorization': `${token}`,
            },
            credentials: "include"
        });

        return res;
    } else if(type == "CREATELISTING"){
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ ...formData }),
            headers: {
                'Authorization': `${token}`,
            },
            credentials: "include"
        });

        return res;
    } else if(type == "GETLISTING"){
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `${token}`,
            },
            credentials: "include"
        });

        return res;
    }  else if(type == "GETLISTINGADMIN"){
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `${token}`,
            },
            credentials: "include"
        });

        return res;
    }  else if (type == "DELETELISTING"){
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                'Authorization': `${token}`,
            },
            credentials: "include"
        });

        return res;
    }  else if(type == "ALLLISTINGS"){
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `${token}`,
            },
            credentials: "include"
        });

        return res;
    } else if (type == "INITIALFETCH"){
        const res = await fetch(url,{
            method:"GET",
            credentials:"include"
        });
        
        return res;
    }
}