import {input,confirm,select,Separator} from "@inquirer/prompts";
// File Class
class File{
    constructor(public name:string,public path:string,public type:string,public fileDate:Date) {}
     get fileType() : string {
        return this.type;
    };
     get FileDate():Date {
        return this.fileDate;
    };
};
interface FileType{
    name:string,
    path:string,
    type:string,
    date:Date,
}
interface FolderType{
    name:string,
    path:string,
    files:FileType[];
}

// Folder Class
class Folder{
    // files:FileType[] = [];
   static folder:FolderType[] = [];
    constructor(public name:string,public path:string,public files:FileType[]) {}
    // static addFile(file:File){
    //     this.files.push(file);
    // };
    static addFolder(folder:FolderType){
        this.folder.push(folder);
    }
    get getFiles(){
        return this.files;
    };
   static get getFolder(){
        return Folder.folder;
    }
    static showFolder(){
        Folder.getFolder.forEach((e) => {
            console.log(`Folder : ${e.name}\n`)
            console.log(e.name);
            console.log(e.path)
            console.log(`\nFile\n`)
            e.files.forEach((e) => {
                console.log(e.name);
                console.log(e.path)
                console.log(e.type)
                console.log(e.date)
            })
        })
    }
};

let isCond = true;
while(isCond){
     let option = await select({message:"Select any one",choices:[{name:"Add Folder",value:"Add Folder"},{name:"Add File",value:"Add File"},{name:"Remove File",value:"Remove File"}]})
     if(option === "Add Folder"){
        while(isCond){
            isCond = true;
            let folderName = await input({message:"Enter a Folder Name"});
        console.log(folderName);
    //   let ourFolder = new Folder(folderName,`/path/${folderName}`);
      let folderObj = {
        name:folderName,
        path:`/path/${folderName}`,
        files:[]
    }
    Folder.addFolder(folderObj)
     let confrm = await confirm({message:"Do you want to add more folder"})
     isCond = confrm;
        }
    }else if(option === "Add File"){
        isCond = true;
        while(isCond){
            let inputFolderName= await input({message:"Please Enter the name of the folder to find the folder"})
        if(inputFolderName === ""){
            console.log("Please Enter the name of the folder");
        }else{
            let findFolder = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === inputFolderName.toLowerCase().split(/\s+/).join(""));
            if(findFolder?.name){
                let fileName = await input({message:"Enter a file name"});
                let fileType = await input({message:"Enter the extension of file"});
                let duplictName = findFolder.files.find((e) => e.name === fileName);
                if(duplictName?.name){
                    console.log(`Please dont be add same name file.`);
                }else{
                    if(fileName.trim() === "".trim()){
                        console.log("Please Enter the Name of the file")
                    }else if(fileType.trim() === "".trim()){
                        console.log("Please Enter the extension of the file")
                    }
                    else{
                        let file:FileType = {name:fileName,path:`/path/${findFolder.name}/${fileName}`,type:fileType, date: new Date()}
                    findFolder.files.push(file)
                    console.log(findFolder);
                    }
                }
                
            }else{
                console.log(`Folder Name: ${inputFolderName} is not available.`);
            }
            
        }
        let addMoreFile = await confirm({message:"Do you want to add more file"}) 
                isCond = addMoreFile;
        }

    }else if(option === "Remove File"){
        isCond = true;
        while(isCond){
            let findFildrName = await input({message:"Enter the Folder name for remove the file"});
            let findNameForRemove = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === findFildrName.toLowerCase().split(/\s+/).join(""))
            if(findNameForRemove?.name){
                let removeName = await input({message:"Enter the name of the file for remove the file"});
                if(removeName === ""){
                    console.log("Please Enter the name of the file")
                }else{
                    let {files} = findNameForRemove;
                    let filtrFiles = files.filter((e) => {
                        return e.name.toLowerCase().split(/\s+/).join("") !== removeName.toLowerCase().split(/\s+/).join("");
                    });
                    findNameForRemove.files = filtrFiles;
                }
            }else{
                console.log(`Folder Name: ${findFildrName} is not available.`)
            }
            let deleteMore = await confirm({message:"Do you want to delete more file"});
            isCond = deleteMore
        }
    }
    let runAgain = await confirm({message:"Do you want to run again."})
    isCond = runAgain;

};
// show the folder and the files of the folder
Folder.showFolder();
