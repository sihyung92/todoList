export default (id, content, status = "active") => {
    return {
        id: id
        ,content: content
        ,status : status
    }
}