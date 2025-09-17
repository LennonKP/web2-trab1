async function deleteUser(userId) {
    try {
        const ret = await fetch(`/users/${userId}`, { method: 'DELETE' })
        if (ret.ok) {
            window.location.reload()
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function setPagination(pageNumber) {
    const url = new URL(window.location.toString());
    url.searchParams.set('page', pageNumber);
    window.location = url.toString();
}

function setUrlParameter(param, value) {
    const url = new URL(window.location.toString());
    value ? url.searchParams.set(param, value) : url.searchParams.delete(param);
    window.location = url.toString();
}

function bindEvents() {
    const fields = ['name', 'email', 'role', 'status', 'date']
    fields.forEach(field => {
        const element = document.getElementById(`${field}-filter`)
        if (element) {
            element.onchange = (event) => setUrlParameter(field, event.target.value)
        }
    })
}

window.onload = () => bindEvents()