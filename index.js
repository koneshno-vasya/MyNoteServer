const express = require("express");
const app = express();
const fs = require("fs");
let list;
let noteNames;

launch();

function launch(){
 	list = "";
 	noteNames = fs.readdirSync("notes");

 	for (let i = 0; i < noteNames.length; i++){
	 	list = list + `<li><a href="/notes/${noteNames[i]}"> ${noteNames[i].slice(0, -4)} </a></li>`;//избавляюсь от расширения .txt
 	}

}

app.get("/",function(request, response){
	launch();
	fs.readFile("site/index.html", "utf8", function(error, data){
		data = data.replace("{notes}", list);
    response.end(data);
  });
});

app.get("/create",function(request, response){
	if(request.query.create){
		fs.writeFileSync(`notes/${request.query.name}.txt`,"");
		response.redirect("https://MyNoteServer--vasya228.repl.co");
	}
	launch();
	fs.readFile("site/index.html", "utf8", function(error, data){
		data = data.replace("{notes}", list);
    response.end(data);		
  });
});




app.get("/notes/:fileName", function(request, response){ 
	console.log(request.url)
	let name = request.params.fileName;
	let currentFile = fs.readFileSync('notes/' + name);
	launch();
	if (request.query.save){													
		fs.writeFile(`notes/${name}`,request.query.text,function(){
			if(!request.query.rename){
				
				response.redirect(`../notes/${name}`);
				
			}
  	});

	}
	if (request.query.delete1){

		fs.unlink(`notes/${name}`,function(){

			response.redirect("https://MyNoteServer--vasya228.repl.co");
			
		});

	} else if (request.query.rename){

		fs.rename(`notes/${name}`,`notes/${request.query.newname}`,function(){

			response.redirect(`../notes/${request.query.newname}`);
			
  	});

	}
	


	fs.readFile("site/note.html", "utf8", function(error, data){
    data = data.replace("{NoteName}", name.slice(0, -4));
		data = data.replace("{text}", currentFile.toString());
    response.end(data);
  });


});


app.listen(3000);