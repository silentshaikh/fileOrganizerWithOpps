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
    static  setFileExtensin(fileName:string):string{
        let startFindExtens = false;
                let extens = "";
                for(let x of fileName){
                    if(x === "."){
                        startFindExtens = true;
                    };
                    if(startFindExtens){
                        extens += x;
                    }else{

                    }
                };
                return extens;
    }
};

let isCond = true;
let fileSyntax = /^[a-z]+(\.[a-z]+)$/;
while(isCond){
     let option = await select({message:"Select any one",choices:[{name:"Add Folder",value:"Add Folder"},{name:"Add File",value:"Add File"},{name:"Remove File",value:"Remove File"},{name:"Rename File",value:"Rename File"},{name:"Remove Folder",value:"Remove Folder"},{name:"Rename Folder",value:"Rename Folder"},{name:"Show Folder",value:"Show Folder"}]})
     if(option === "Add Folder"){
        while(isCond){
            isCond = true;
            // give me the name of the folder for add the folder
            let folderName = await input({message:"Enter a Folder Name"});
            //find duplicate folder name
            let duplictFolderName = Folder.folder.find((e) => e.name === folderName);
        if(duplictFolderName?.name){
            //if folder is already exist
            console.log(`Folder: ${folderName} is already exist`);
        }else{
            if(folderName.trim() === "" ){
                //if folderName is empty
                console.log("Please Enter a Folder Name for create a folder")
            }else{
                //print the folder name
                console.log(`Folder :${folderName}`);
    //   let ourFolder = new Folder(folderName,`/path/${folderName}`);
    // create the object of the folder
      let folderObj = {
        name:folderName,
        path:`/path/${folderName}`,
        files:[]
    }
    //push the object in the folder array
    Folder.addFolder(folderObj);
            }
        }
    //provide confirmation for run again the add folder process
     let confrm = await confirm({message:"Do you want to add more folder"})
     isCond = confrm;
        }
    }else if(option === "Add File"){
        isCond = true;
        while(isCond){
            // give the name of the file for add the file
            let inputFolderName= await input({message:"Please Enter the name of the folder to find the folder"})
        if(inputFolderName === ""){
            console.log("Please Enter the name of the folder");
        }else{
            let findFolder = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === inputFolderName.toLowerCase().split(/\s+/).join(""));
            if(findFolder?.name){
                let fileName = await input({message:"Enter a file name"});
                //check if file name exist in the files
                let duplictName = findFolder.files.find((e) => e.name === fileName);
                if(duplictName?.name){
                    console.log(`Please dont be add same name file.`);
                }else{
                    if(fileName.trim() === ""){
                        console.log("Please Enter the Name of the file");
                    }
                    else{
                        if(fileName.toLowerCase().match(fileSyntax)){
                            // create the object of the file
                        let file:FileType = {name:fileName,path:`/path/${findFolder.name}/${fileName}`,type:Folder.setFileExtensin(fileName), date: new Date()}
                        //push the object in the file array
                    findFolder.files.push(file)
                    console.log(findFolder);
                        }else{
                            console.log("Please give the extension of file with . notation");
                        }
                    }
                }
                
            }else{
                //if folder is not available for add files in a folder 
                console.log(`Folder Name: ${inputFolderName} is not available.`);
            }
            
        }
        //provide confirmation for run again the add file process
        let addMoreFile = await confirm({message:"Do you want to add more file"}) 
                isCond = addMoreFile;
        }

    }else if(option === "Remove File"){
        isCond = true;
        while(isCond){
            //give the folder name for remove file in a folder
            let findFildrName = await input({message:"Enter the Folder name for remove the file"});
            if(findFildrName.trim() === ""){
                console.log("Please Enter the name of the folder for remove the file in the folder/")
            }else{
                //find the folder name for remove the file of the folder
            let findNameForRemove = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === findFildrName.toLowerCase().split(/\s+/).join(""))
            if(findNameForRemove?.name){
                //give the name of the file for remove this file
                let removeName = await input({message:"Enter the name of the file for remove the file"});
                if(removeName.trim() === ""){
                    console.log("Please Enter the name of the file")
                }else{
                    //destructuring the object
                    let {files} = findNameForRemove;
                    let findFileRemov = files.find((e) => e.name === removeName);
                   if(findFileRemov?.name){
                    // filter the file array
                    let filtrFiles = files.filter((e) => {
                        return e.name.toLowerCase().split(/\s+/).join("") !== removeName.toLowerCase().split(/\s+/).join("");
                    });
                    // and update the filter file array
                    findNameForRemove.files = filtrFiles;
                   }else{
                     console.log(`File : ${removeName} is not available`)
                   }
                }
            }else{
                //if folder is not available for remove a file
                console.log(`Folder Name: ${findFildrName} is not available.`)
            }
            }
            //provide confirmation for run again the delete process
            let deleteMore = await confirm({message:"Do you want to delete more file"});
            isCond = deleteMore
        }
    }else if(option === "Rename File"){
        isCond = true;
        while(isCond){
            //give the folder name for edit name of the file file in a folder
            let findFoldr = await input({message:"If you want to rename the name of the file, so please give me the name of the folder for rename the file"});
            //give empty input
            if(findFoldr.trim() === ""){
                console.log("Please Enter the name of the folder for rename the file of the folder.")
            }else{
                //find the folder name for edit the name of the file of the folder
            let findFolderForEdit = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === findFoldr.toLowerCase().split(/\s+/).join(""));
            if(findFolderForEdit?.name){
                // give the name of the file for edit the file
                let FileName = await input({message:"Enter the name of the file for rename the file."});
                //destructuring the folder object
                let {files} = findFolderForEdit;
                //find the file name
                let findFile = files.find((e) => e.name === FileName);
                if(findFile?.name){
                    //give the new name of the file
                    let editFileName = await input({message:"Enter the new name of the file"});
                    //check if new name is already exist in the files
                    let findDUplictName = files.find((e) => e.name === editFileName);
                    if(findDUplictName?.name){
                        console.log(`File Name : ${editFileName} is already exist`)
                    }else{
                        if(editFileName.trim() === ""){
                            console.log("Please Enter the new Name of the file")
                        }
                        else{
                           if(editFileName.toLowerCase().match(fileSyntax)){
                             //Update the file 
                             findFile.name = editFileName;
                             findFile.path = `/path/${findFolderForEdit.name}/${editFileName}`;
                             findFile.type = Folder.setFileExtensin(editFileName);
                             findFile.date = new Date();
                           }else{
                            console.log(`Please give the extension of file with . notation`);
                           }
                        }
                    }
                }else{
                    //if file is available for edit the file
                    console.log(`File :${FileName} is not avaiable.`);
                }
            }else{
                //if folder is available for edit the file
                console.log(`Folder : ${findFoldr} is not available.`)
            }
            }
            //give confirmation for run again this edit process
            let editMoreFile = await confirm({message:"Do you want to edit more file"});
            isCond = editMoreFile;
        }
    }else if(option === "Remove Folder"){
        isCond = true;
        while(isCond){
            //give the folder name for delete the folder
        let findFolder = await input({message:"Enter the folder name for remove the folder"});
        if(findFolder.trim() === ""){
            console.log("Please Enter the folder name. ")
        }else{
            //find the folder for delte the folder
            let findFolderForDelete = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === findFolder.toLowerCase().split(/\s+/).join(""));
            if(findFolderForDelete?.name){
                let filterFolder = Folder.folder.filter((e) => {
                    return e.name.toLowerCase().split(/\s+/).join("") !== findFolderForDelete.name.toLowerCase().split(/\s+/).join("");
                });
                //update the folder array
                Folder.folder = filterFolder;
            }else{
                //if folder is not available
                console.log(`Folder :${findFolder} is not available.`);
            }
        }
        //if you want to run again this delete process
        let deleteMoreFolder = await confirm({message:"Do you want to delte more folder."});
        isCond = deleteMoreFolder;
        }
    }else if(option === "Rename Folder"){
        isCond = true;
        while(isCond){
            //give the name of the folder
           let foldrName = await input({message:"If you want to rename the name of the folder, so please give me the name of the folder."});
           if(foldrName.trim() === ""){
            console.log("Please Enter the name of the folder for rename the folder");
           }else{
            //find folder for edit
           let findFoldrForEdit = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === foldrName.toLowerCase().split(/\s+/).join(""));
           if(findFoldrForEdit?.name){
            //give the new name of the folder
            let editFolderName = await input({message:"Enter the new name of the Folder."});
           if(editFolderName.trim() === ""){
            console.log("Please Enter the new name of the folder");
           }else{
             //find duplicate name of the folder
             let duplictFoldrName= Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === editFolderName.toLowerCase().split(/\s+/).join(""));
             if(duplictFoldrName?.name){
                 console.log(`Folder : ${editFolderName} is already exist.`);
             }else{
                //update the folder detail
                 findFoldrForEdit.name = editFolderName;
                 findFoldrForEdit.path = `/path/${editFolderName}`;
                 let mapFiles:FileType[] = findFoldrForEdit.files.map((e) =>  ({
                     name:e.name,
                     path:`${findFoldrForEdit.path}/${e.name}`,
                     type:e.type,
                     date:e.date,
                 }));
                 findFoldrForEdit.files = mapFiles;                
             }
           }
           }else{
            console.log(`Folder : ${foldrName} is not available.`);
           }
           }

           let moreEditFolder = await confirm({message:"Do you want to edit more Folder"});
           isCond = moreEditFolder;

        }

    }else if(option === "Show Folder"){
         isCond = true;
        while(isCond){
            let searchFolder = await input({message:"Enter the name of the folder for show the folder"})
        if(searchFolder.trim() === ""){
            console.log("Please Enter thr name of the folder.");
        }else{
            let findFolderForShow = Folder.folder.find((e) => e.name.toLowerCase().split(/\s+/).join("") === searchFolder.toLowerCase().split(/\s+/).join(""));
            if(findFolderForShow){
                let {name,path,files} = findFolderForShow;
                console.log(`\n \t### Folder :${name} . ###\n`);
                console.log(`\n \t### Folder Path :${path} . ###\n`);
                console.log(`\t \t ### FILES ### \n`)
                console.log(`\t ---------------------\n`)
                files.forEach((e:FileType):void => {
                    console.log(`\t FILE NAME : ${e.name} . \n`);
                    console.log(`\t FILE PATH : ${e.path} . \n`);
                    console.log(`\t FILE TYPE : ${e.type} . \n`);
                    console.log(`\t FILE DATE : ${e.date.getDate()}-${e.date.getMonth()+1}-${e.date.getFullYear()} . \n`);
                    console.log(`\t ---------------------\n`)
                })
            }else{
                console.log(`\n Folder : ${searchFolder} is not available`)
            }
        }
        let showMreFolder = await confirm({message:"Do you want to show again the folders."})
        isCond = showMreFolder;
        }
    }
    //provide confirmation for run again this process
    let runAgain = await confirm({message:"Do you want to run again."})
    isCond = runAgain;

};

