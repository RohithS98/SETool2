const API = 'https://api.github.com/repos/'
const LI_TAG_ID = 'github-repo-size'
const GITHUB_TOKEN_KEY = 'x-github-token'

const storage = chrome.storage.sync || chrome.storage.local

let githubToken

const isPull = (uri) => {
  const repoURI = uri.split('/')

  return repoURI.length === 3 || repoURI[2] === 'pulls'
}
/*
const getRepoInfoURI = (uri) => {
  const repoURI = uri.split('/')

  return repoURI[0] + '/' + repoURI[1]
}
*/
function removePull(uri){
	uri1 = uri.split('/')
	uri1.pop()
	return uri1.join('/')
}
/*
const getRepoContentURI = (uri) => {
  const repoURI = uri.split('/')
  const treeBranch = repoURI.splice(2, 2, 'contents')

  if (treeBranch && treeBranch[1]) {
    repoURI.push('?ref=' + treeBranch[1])
  }

  return repoURI.join('/')
}

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  throw Error(`GitHub returned a bad status: ${response.status}`)
}

const parseJSON = (response) => {
  if (response) {
    return response.json()
  }

  throw Error('Could not parse JSON')
}

const getAPIData = (uri, callback) => {
  const headerObj = {
    'User-Agent': 'Rohith'
  }

  const token = localStorage.getItem(GITHUB_TOKEN_KEY) || githubToken

  if (token) {
    headerObj['Authorization'] = 'token ' + token
  }

  const request = new Request(API + uri, {
    headers: new Headers(headerObj)
  })
  console.log(request)

  fetch(request)
    .then(checkStatus)
    .then(parseJSON)
    .then(callback)
    .catch(e => console.error(e))
}
*/
const getFileName = (text) => text.trim().split('/')[0]

function click1(){
	contentList = []
	getFile()
	console.log(contentList)
}

const checkForRepoPage = () => {
  let repoURI = window.location.pathname.substring(1)
  repoURIp = repoURI.endsWith('/') ? repoURI.slice(0, -1) : repoURI
  repoURI = removePull(repoURIp)
  setRepo(repoURI)
  console.log(repoURI)
  if (isPull(repoURIp)) {
    const ns = document.querySelector('ul.numbers-summary')
    const liElem = document.getElementById(LI_TAG_ID)
    const tdElems = document.querySelector('span.github-repo-size-td')
	
	var pulls = document.querySelectorAll('div > div.float-left.col-9.lh-condensed.p-2')
	var i
	console.log("Is in pull",pulls.length)
	for(i = 0; i < pulls.length; i++){
		const bu = document.createElement('div')
		bu.className = 'getMetrics'
		console.log('pull'+i)
		bu.addEventListener("click",click1)
		bu.innerHTML = "<button style=\"height=5px;width=5px;margin-top:5px\" class=\"pull\""+i+">Analyse</button>"
		pulls[i].append(bu)
		console.log(bu)
	}
  }
}

storage.get(GITHUB_TOKEN_KEY, function (data) {
  githubToken = data[GITHUB_TOKEN_KEY]

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes[GITHUB_TOKEN_KEY]) {
      githubToken = changes[GITHUB_TOKEN_KEY].newValue
    }
  })

  document.addEventListener('pjax:end', checkForRepoPage, false)

  checkForRepoPage()
})
///