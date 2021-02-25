

let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    currentRover: '',
    currentPage: 'home'
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}
  
const render = async (root, state) => {
    root.innerHTML = App(state)
  
}


// create content
const App =  (state) => {
    if(state['currentPage'] === 'home'){
        return 'this is the home page'
    }else{
        return getInfo(state)
    }
}

const apod = (state) => {
     let {  apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
    console.log(store)
    return data
}


//create an interface for the photo gallery

//create a ui to select which rover want to view 

//create an option for latest photos or search query for a particualr date (delay this)

//create filters based on camera view  options TODO

// The launch date, landing date, name and status along with any other information about the rover
//A selection bar for the user to choose which rover's information they want to see

const getInfo = async (state) => {
       let {currentRover} = state; 
        const responsePhotos = await fetch(`http://localhost:3000/rover/${currentRover}`)
        .then( res => res.json())
        const responseRoverManifest = await fetch(`http://localhost:3000/manifests/${currentRover}`)
        .then(res => res.json())
        const data = responsePhotos['latest_photos']
        const photos = formatPhotos(data);
        const rover = formatRoverData(responseRoverManifest['photo_manifest']); 
        appendData(photos, rover);

    }



    const formatRoverData =  (data) => {
        let roverData =  `
            
              <summary>${data['name']} Rover Details</summary> 
              <p>Launch Date:${data['launch_date']}</p>
              <p> Landing Date:${data['landing_date']}</p>
              <p>Status: ${data['status']}</p>
        `
        return  roverData
    }

//creates an array to share photos, photo info 
const formatPhotos= (data) => {
   
   let photos = data.map(function(photo, data){
        return `
        <figure> 
         <img src=${photo['img_src']} height='100px' min-width-"80vw" alt="a mars photo taken from ">
         <figcaption>Earth Date Taken on ${photo['earth_date']}<br>
            Sol Date Taken on ${photo['sol']}<br>
            Camera angle: ${photo['camera']['full_name']}
         </figcaption>
        </figure>
        `
    })
    return photos
}
const getCurrentRover = (event) => {
    return currentRover
}

const appendData =  (photos, roverData ) => {
    let roverInfo = roverData;
    let background = document.createElement('article');
    let roverBox = document.createElement('details')
    const main = document.querySelector('main')
    
    roverBox.innerHTML = roverInfo;
    background.appendChild(roverBox)
    photos.forEach(photo => {
        let photoBorder = document.createElement('div',); 
        photoBorder.classList.add('rover-photos')
        photoBorder.innerHTML = photo
        background.appendChild(photoBorder)
    })
    console.log(background)
    return background
}

//event listeners section
//mobile view nav menu panel
const hamburger = document.querySelector('.hamburger-menu')
hamburger.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.mobile-nav-background')
    navMenu.classList.toggle('close')

})

//menu,nav, subsections events listeners

const roverSubSectionIcon = document.querySelector('.menu-expander')
roverSubSectionIcon.addEventListener('click', (e) => {
    const subMenu = document.querySelector('.rover-options');
    subMenu.classList.toggle('close')
    roverSubSectionIcon.classList.toggle('open')
   
})

const curiosityTab = document.querySelector('#curiosity-tab')
const opportunityTab = document.querySelector('#opportunity-tab')
const spiritTab = document.querySelector('#spirit-tab')
const home = document.querySelector('.home')

curiosityTab.addEventListener('click', (e) => {
    const name = {currentRover: 'curiosity', currentPage:'curiosity'}
    updateStore(store, name)
})

opportunityTab.addEventListener('click', (e) => {
    const name = {currentRover: 'opportunity', currentPage:'opportunity'}
    updateStore(store, name)

})

spiritTab.addEventListener('click', (e) => {
    const name = {currentRover: 'spirit', currentPage:'spirit'}
    updateStore(store, name)
})   

home.addEventListener('click', (e) => {
    updateStore(store, {currentPage: 'home'})
})
