var SCHEMA_NAME = 'group',
	SCHEMA_VERSION = 1,
	queryParams = {
		begin: '2010',
		end: '2013',
		group: 'SI'
	};

function startDb(success) {
	var openRequest = indexedDB.open('lattes-dashboard');
	openRequest.onupgradeneeded = function (event) {
	    var db = event.target.result,
	    	objectStore = db.createObjectStore(SCHEMA_NAME, { keyPath: "name" }),
	    	group = {
	    		name: 'SI',
	    		users: [
	                'http://lattes.cnpq.br/5812687200309236',
	                'http://lattes.cnpq.br/1155348824161559',
	                'http://lattes.cnpq.br/3929942929482246',
	                'http://lattes.cnpq.br/1641964252508999',
	                'http://lattes.cnpq.br/6503269153478973',
	                'http://lattes.cnpq.br/8841840830171267',
	                'http://lattes.cnpq.br/6581012116833368',
	                'http://lattes.cnpq.br/0537601054260366',
	                'http://lattes.cnpq.br/4995205101828752',
	                'http://lattes.cnpq.br/9182535209147578',
	                'http://lattes.cnpq.br/5246678822563192',
	                'http://lattes.cnpq.br/1376315663238484',
	                'http://lattes.cnpq.br/1070291283812879',
	                'http://lattes.cnpq.br/3864977515064821',
	                'http://lattes.cnpq.br/7580475626591643',
	                'http://lattes.cnpq.br/4034572067207920',
        		]
        	};

		objectStore.add(group);
	}

	openRequest.onsuccess = success;
}

function insertGroup(name, users) {
	var group = {
		name: name,
		users: users
	};

	startDb(function(event) {
		var db = event.target.result,
			transaction = db.transaction([SCHEMA_NAME], 'readwrite'),
			objectStore = transaction.objectStore(SCHEMA_NAME);

		objectStore.add(group);
	});
}

function removeGroup(name) {
	startDb(function(event) {
		var db = event.target.result,
			transaction = db.transaction([SCHEMA_NAME], 'readwrite'),
			objectStore = transaction.objectStore(SCHEMA_NAME);

		objectStore.delete(name);
	})
}

function getAllGroups(endCallback) {
	var groups = [];
	startDb(function(event) {
		var db = event.target.result,
			transaction = db.transaction([SCHEMA_NAME], 'readwrite'),
			objectStore = transaction.objectStore(SCHEMA_NAME);


		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;

			if (cursor) {
				groups.push(cursor.value);
				cursor.continue();
			} else {
				endCallback(groups);
			}
		};
	})
}

function getGroupMembers(endCallback) {
	startDb(function(event) {
		var db = event.target.result,
			transaction = db.transaction([SCHEMA_NAME], 'readwrite'),
			objectStore = transaction.objectStore(SCHEMA_NAME);

		objectStore.get(queryParams.group).onsuccess = function(event) {
			if (event.target.result) {
				endCallback(event.target.result.users);
			}
		};
	})
}

function getUserData(lattes) {
	var jsonData = $.ajax({
			url: 'http://ws-lattes.gopagoda.com/users?lattes='+lattes,
			dataType:"json",
			async: false
	    }).responseText;

	return JSON.parse(jsonData);
}

function parseQueryString() {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        queryParams[pair[0]] = pair[1];
    }
}
