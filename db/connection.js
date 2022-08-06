import mongoose from "mongoose"

const connect = async (uri) => {
    await mongoose
        .connect(uri)
        .then(() => {
            console.log('>>Połączono z bazą danych.')
        })
        .catch(err => {
            console.log(err)
            console.log('!!Nie udało się połączyć z bazą danych')
        })
}

export default connect