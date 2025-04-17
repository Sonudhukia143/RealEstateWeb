export default async function fetchData(url, formData,type,token) {
    if(type == "SIGNIN"){
        let base64String;

        if(typeof formData.img == "string"){
            base64String = formData.img 
        }else if(typeof formData.img == "object"){
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
            body: JSON.stringify({blobImg:base64String , ...formData}),
            credentials: "include"
        });
    
        return res;
    }else if(type == "UPDATE"){
        let base64String;

        if(typeof formData.img == "string"){
            base64String = formData.img 
        }else if(typeof formData.img == "object"){
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
            body: JSON.stringify({blobImg:base64String,...formData,token:token}),
            credentials:"include"
        });

        return res;
    }else if(type == "LOGIN"){
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({...formData}),
            credentials:"include"
        });
        
        return res;
    }else if(type == "CHANGEPASS"){
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({...formData,token:token}),
            credentials:"include"
        });
        
        return res;
    }
}