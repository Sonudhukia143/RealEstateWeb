export default async function verifyEmail (state,setVerifyText,setLoading,dispatch,signInSuccess,token) {
    if (state?.emailVerified) {
      setVerifyText("Verified");
      return;
    };

    setLoading(true);
    setVerifyText("Sending Email...");

    try {
      const res = await fetch('http://localhost:3000/api/request-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
      });

      const data = await res.json();

      if (res.status == 200) {
        setVerifyText("Check Mail And Verify");
      } else if (res.status == 201) {
        if (data.user.emailVerified) {
          setLoading(false);
          setVerifyText("Verified");
          dispatch(signInSuccess(data));
        }
      } else {
        setLoading(false);
        setVerifyText(data.message || "Error Occurred");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      setVerifyText("Unexpected Error Occurred");
    } finally {
      setLoading(false);
    }
  }