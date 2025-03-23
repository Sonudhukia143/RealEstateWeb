const signUpHandleChange = (e,ref,setFormData,formData) => {
    if(ref != "img"){
        setFormData({...formData,[ref]:e.target.value});
    }
    
    if(ref == "img"){
        const file = e.target.files[0];
        if (file) {
            // Check file size
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
                alert("File size exceeds 5MB. Please upload a smaller file.");
                return;
            }

            setFormData({...formData, [ref]:file})

            const previewUrl = URL.createObjectURL(file);
            setFormData(prevState => ({...prevState , previewUrl:previewUrl}));
        }
    }
}


const loginHandleChange = (e,ref,setFormData,formData) => {
    setFormData({...formData, [ref]:e.target.value});
}

export {signUpHandleChange,loginHandleChange};