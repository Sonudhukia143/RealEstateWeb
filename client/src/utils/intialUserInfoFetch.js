export default async function fetchDetails (setLoading,token) {
      setLoading(true);

      try {
        const res = await fetch(`http://localhost:3000/api/fetch-info/${token}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res) {
          return res;
        } else {
          console.error('Error fetching user details');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    }

    