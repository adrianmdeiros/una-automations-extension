export const profiles = [
    'PROFISSIONAL',
]

export function createProfilesOptions() {
    const profilesList = document.getElementById('profiles-select')
    profiles.forEach(profile => {
        const profileOption = document.createElement('option')
        profileOption.value = profile
        profileOption.textContent = profile
        profilesList.appendChild(profileOption)
    })
}

createProfilesOptions()

const profilesList = document.querySelector('#profiles-select')
export const selectedProfile = profilesList.addEventListener('change', () => {
    return profilesList.value
})