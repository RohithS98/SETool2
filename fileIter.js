var contentList = []
var repoName = ""

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

const getExtension = (file) => {
	return file.split('.').pop()
}

function sortFile(response){
	if(Array.isArray(response)){
		var i
		for(i = 0; i < response.length; i++){
			if(response[i].name.includes('.') && response.type == "file"){
				if(getExtension(response.name) == ".py"){
					getFile(response.name)
				}
			}
		}
	}
	else{
		contentList.push({
			name : repsonse.name,
			content : repsonse.content
		})
	}
}

function setRepo(repo){
	repoName = repo
}

function getFile(fileName){
	const headerObj = {
    'User-Agent': 'Rohith'
  }

  const token = localStorage.getItem(GITHUB_TOKEN_KEY) || githubToken

  if (token) {
    headerObj['Authorization'] = 'token ' + token
  }

  const request = new Request(API + repoName + "/contents/" + fileName, {
    headers: new Headers(headerObj)
  })
  console.log(request)

  fetch(request)
    .then(checkStatus)
    .then(parseJSON)
    .then()
    .catch(e => console.error(e))
}