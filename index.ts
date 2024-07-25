#! /usr/bin/env node
import { input, confirm, select } from "@inquirer/prompts";
import chalk from "chalk";
// File Class
class File {
  constructor(
    public name: string,
    public path: string,
    public type: string,
    public fileDate: Date
  ) {}

}
interface FileType {
  name: string;
  path: string;
  type: string;
  date: Date;
}
interface FolderType {
  name: string;
  path: string;
  files: FileType[];
}

// Folder Class
class Folder {
  static folder: FolderType[] = [];
  constructor(
    public name: string,
    public path: string,
    public files: FileType[]
  ) {}
  static addFolder(folder: FolderType) {
    this.folder.push(folder);
  }
  static setFileExtensin(fileName: string): string {
    let startFindExtens = false;
    let extens:string = "";
    for (let x of fileName) {
      if (x === ".") {
        startFindExtens = true;
      }
      if (startFindExtens) {
        extens += x;
      } else {
      }
    }
    return extens;
  }
  static folderEmpty() {
    console.log(chalk.red("\n\t ########################## \n"));
    console.log(chalk.red(chalk.italic("\t# FOLDER LIST IS EMPTY #")));
    console.log(chalk.red("\n\t ########################## \n"));
  }
}

let isCond:boolean = true;
let fileSyntax = /^[a-z]+(\.[a-z]+)$/;
while (isCond) {
  let option:string = await select({
    message: chalk.cyanBright(
      chalk.italic(chalk.bold("\n  Please Select any one \n"))
    ),
    choices: [
      {
        name: chalk.greenBright(chalk.italic("Add Folder")),
        value: "Add Folder",
      },
      { name: chalk.italic(chalk.greenBright("Add File")), value: "Add File" },
      {
        name: chalk.italic(chalk.greenBright("Remove File")),
        value: "Remove File",
      },
      {
        name: chalk.italic(chalk.greenBright("Rename File")),
        value: "Rename File",
      },
      {
        name: chalk.greenBright(chalk.italic("Remove Folder")),
        value: "Remove Folder",
      },
      {
        name: chalk.italic(chalk.greenBright("Rename Folder")),
        value: "Rename Folder",
      },
      {
        name: chalk.italic(chalk.greenBright("Show Folder")),
        value: "Show Folder",
      },
      {
        name: chalk.italic(chalk.greenBright("Move File")),
        value: "Move File",
      },
    ],
  });
  if (option === "Add Folder") {
    while (isCond) {
      isCond = true;
      // give me the name of the folder for add the folder
      let folderName:string = await input({ message: "Enter a Folder Name" });
      //find duplicate folder name
      let duplictFolderName = Folder.folder.find((e) => e.name === folderName);
      if (duplictFolderName?.name) {
        //if folder is already exist
        console.log(
          chalk.red(
            chalk.italic(` \n \tFolder: ${folderName} is already exist \n`)
          )
        );
      } else {
        if (folderName.trim() === "") {
          //if folderName is empty
          console.log(
            chalk.red(
              chalk.italic(
                " \n \tPlease Enter a Folder Name for create a folder \n"
              )
            )
          );
        } else {
          //print the folder name
          console.log(
            chalk.greenBright(
              chalk.italic(
                ` \n \tFolder : ${chalk.bold(chalk.cyanBright(folderName))} \n`
              )
            )
          );
          // create the object of the folder
          let folderObj = {
            name: folderName,
            path: `/path/${folderName}`,
            files: [],
          };
          //push the object in the folder array
          Folder.addFolder(folderObj);
        }
      }
      //provide confirmation for run again the add folder process
      let confrm = await confirm({ message: "Do you want to add more folder" });
      isCond = confrm;
    }
  } else if (option === "Add File") {
    isCond = true;
    if (Folder.folder.length === 0) {
      Folder.folderEmpty();
    } else {
      while (isCond) {
        // give the name of the file for add the file
        let inputFolderName:string = await input({
          message: "Please Enter the name of the folder to find the folder",
        });
        if (inputFolderName === "") {
          console.log(
            chalk.red(
              chalk.italic(" \n \tPlease Enter the name of the folder \n")
            )
          );
        } else {
          let findFolder:FolderType|undefined = Folder.folder.find(
            (e) =>
              e.name.toLowerCase().split(/\s+/).join("") ===
              inputFolderName.toLowerCase().split(/\s+/).join("")
          );
          if (findFolder?.name) {
            let fileName:string = await input({ message: "Enter a file name" });
            //check if file name exist in the files
            let duplictName:FileType|undefined = findFolder.files.find((e) => e.name === fileName);
            if (duplictName?.name) {
              console.log(
                chalk.red(
                  chalk.italic(`\n \tPlease dont be add same name file.\n`)
                )
              );
            } else {
              if (fileName.trim() === "") {
                console.log(
                  chalk.red(
                    chalk.italic("\n \tPlease Enter the Name of the file\n")
                  )
                );
              } else {
                if (fileName.toLowerCase().match(fileSyntax)) {
                  // create the object of the file
                  let file: FileType = {
                    name: fileName,
                    path: `/path/${findFolder.name}/${fileName}`,
                    type: Folder.setFileExtensin(fileName),
                    date: new Date(),
                  };
                  //push the object in the file array
                  findFolder.files.push(file);
                  console.log(findFolder);
                } else {
                  console.log(
                    chalk.red(
                      chalk.italic(
                        "\n \tPlease give the extension of file with . notation\n"
                      )
                    )
                  );
                }
              }
            }
          } else {
            //if folder is not available for add files in a folder
            console.log(
              chalk.red(
                chalk.italic(
                  `\n \tFolder Name: ${chalk.cyanBright(
                    chalk.bold(inputFolderName)
                  )} is not available.\n`
                )
              )
            );
          }
        }
        //provide confirmation for run again the add file process
        let addMoreFile:boolean = await confirm({
          message: "Do you want to add more file",
        });
        isCond = addMoreFile;
      }
    }
  } else if (option === "Remove File") {
    isCond = true;
    if (Folder.folder.length === 0) {
      Folder.folderEmpty();
    } else {
      while (isCond) {
        //give the folder name for remove file in a folder
        let findFildrName:string = await input({
          message: "Enter the Folder name for remove the file",
        });
        if (findFildrName.trim() === "") {
          console.log(
            chalk.red(
              chalk.italic(
                "\n \tPlease Enter the name of the folder for remove the file in the folder\n"
              )
            )
          );
        } else {
          //find the folder name for remove the file of the folder
          let findNameForRemove:FolderType|undefined = Folder.folder.find(
            (e) =>
              e.name.toLowerCase().split(/\s+/).join("") ===
              findFildrName.toLowerCase().split(/\s+/).join("")
          );
          if (findNameForRemove?.name) {
            //give the name of the file for remove this file
            let removeName:string = await input({
              message: "Enter the name of the file for remove the file",
            });
            if (removeName.trim() === "") {
              console.log(
                chalk.red(
                  chalk.italic("\n \tPlease Enter the name of the file\n")
                )
              );
            } else {
              //destructuring the object
              let { files } = findNameForRemove;
              let findFileRemov:FileType|undefined = files.find((e) => e.name === removeName);
              if (findFileRemov?.name) {
                // filter the file array
                let filtrFiles:FileType[] = files.filter((e) => {
                  return (
                    e.name.toLowerCase().split(/\s+/).join("") !==
                    removeName.toLowerCase().split(/\s+/).join("")
                  );
                });
                // and update the filter file array
                findNameForRemove.files = filtrFiles;
              } else {
                console.log(
                  chalk.red(
                    chalk.italic(
                      `\n \tFile : ${chalk.cyanBright(
                        chalk.bold(removeName)
                      )} is not available\n`
                    )
                  )
                );
              }
            }
          } else {
            //if folder is not available for remove a file
            console.log(
              chalk.red(
                chalk.italic(
                  `\n \tFolder Name: ${chalk.cyanBright(
                    chalk.bold(findFildrName)
                  )} is not available.\n`
                )
              )
            );
          }
        }
        //provide confirmation for run again the delete process
        let deleteMore:boolean = await confirm({
          message: "Do you want to delete more file",
        });
        isCond = deleteMore;
      }
    }
  } else if (option === "Rename File") {
    isCond = true;
    if (Folder.folder.length === 0) {
      Folder.folderEmpty();
    } else {
      while (isCond) {
        //give the folder name for edit name of the file file in a folder
        let findFoldr:string = await input({
          message:
            "If you want to rename the name of the file, so please give me the name of the folder for rename the file",
        });
        //give empty input
        if (findFoldr.trim() === "") {
          console.log(
            chalk.red(
              chalk.italic(
                "\n \tPlease Enter the name of the folder for rename the file of the folder.\n"
              )
            )
          );
        } else {
          //find the folder name for edit the name of the file of the folder
          let findFolderForEdit:FolderType|undefined = Folder.folder.find(
            (e) =>
              e.name.toLowerCase().split(/\s+/).join("") ===
              findFoldr.toLowerCase().split(/\s+/).join("")
          );
          if (findFolderForEdit?.name) {
            // give the name of the file for edit the file
            let FileName:string = await input({
              message: "Enter the name of the file for rename the file.",
            });
            //destructuring the folder object
            let { files } = findFolderForEdit;
            //find the file name
            let findFile:FileType| undefined = files.find((e) => e.name === FileName);
            if (findFile?.name) {
              //give the new name of the file
              let editFileName:string = await input({
                message: "Enter the new name of the file",
              });
              //check if new name is already exist in the files
              let findDUplictName:FileType| undefined = files.find((e) => e.name === editFileName);
              if (findDUplictName?.name) {
                console.log(
                  chalk.red(
                    chalk.italic(
                      `\n \tFile Name : ${chalk.cyanBright(
                        chalk.bold(editFileName)
                      )} is already exist\n`
                    )
                  )
                );
              } else {
                if (editFileName.trim() === "") {
                  console.log(
                    chalk.red(
                      chalk.italic(
                        "\n \tPlease Enter the new Name of the file\n"
                      )
                    )
                  );
                } else {
                  if (editFileName.toLowerCase().match(fileSyntax)) {
                    //Update the file
                    findFile.name = editFileName;
                    findFile.path = `/path/${findFolderForEdit.name}/${editFileName}`;
                    findFile.type = Folder.setFileExtensin(editFileName);
                    findFile.date = new Date();
                  } else {
                    console.log(
                      chalk.red(
                        chalk.italic(
                          `\n \tPlease give the extension of file with . notation\n`
                        )
                      )
                    );
                  }
                }
              }
            } else {
              //if file is available for edit the file
              console.log(
                chalk.red(
                  chalk.italic(
                    `\n \tFile : ${chalk.cyanBright(
                      chalk.bold(FileName)
                    )} is not avaiable.\n`
                  )
                )
              );
            }
          } else {
            //if folder is available for edit the file
            console.log(
              chalk.red(
                chalk.italic(
                  `\n \tFolder : ${chalk.cyanBright(
                    chalk.bold(findFoldr)
                  )} is not available.\n`
                )
              )
            );
          }
        }
        //give confirmation for run again this edit process
        let editMoreFile = await confirm({
          message: "Do you want to edit more file",
        });
        isCond = editMoreFile;
      }
    }
  } else if (option === "Remove Folder") {
    isCond = true;
    if (Folder.folder.length === 0) {
      Folder.folderEmpty();
    } else {
      while (isCond) {
        //give the folder name for delete the folder
        let findFolder = await input({
          message: "Enter the folder name for remove the folder",
        });
        if (findFolder.trim() === "") {
          console.log(
            chalk.red(chalk.italic("\n \tPlease Enter the folder name. \n"))
          );
        } else {
          //find the folder for delte the folder
          let findFolderForDelete:FolderType|undefined = Folder.folder.find(
            (e) =>
              e.name.toLowerCase().split(/\s+/).join("") ===
              findFolder.toLowerCase().split(/\s+/).join("")
          );
          if (findFolderForDelete?.name) {
            let filterFolder:FolderType[] = Folder.folder.filter((e) => {
              return (
                e.name.toLowerCase().split(/\s+/).join("") !==
                findFolderForDelete.name.toLowerCase().split(/\s+/).join("")
              );
            });
            //update the folder array
            Folder.folder = filterFolder;
          } else {
            //if folder is not available
            console.log(
              chalk.red(
                chalk.italic(
                  `\n \tFolder : ${chalk.cyanBright(
                    chalk.bold(findFolder)
                  )} is not available.\n`
                )
              )
            );
          }
        }
        //if you want to run again this delete process
        let deleteMoreFolder = await confirm({
          message: "Do you want to delte more folder.",
        });
        isCond = deleteMoreFolder;
      }
    }
  } else if (option === "Rename Folder") {
    isCond = true;
    if (Folder.folder.length === 0) {
      Folder.folderEmpty();
    } else {
      while (isCond) {
        //give the name of the folder
        let foldrName = await input({
          message:
            "If you want to rename the name of the folder, so please give me the name of the folder.",
        });
        if (foldrName.trim() === "") {
          console.log(
            chalk.red(
              chalk.italic(
                "\n \tPlease Enter the name of the folder for rename the folder\n"
              )
            )
          );
        } else {
          //find folder for edit
          let findFoldrForEdit:FolderType|undefined = Folder.folder.find(
            (e) =>
              e.name.toLowerCase().split(/\s+/).join("") ===
              foldrName.toLowerCase().split(/\s+/).join("")
          );
          if (findFoldrForEdit?.name) {
            //give the new name of the folder
            let editFolderName = await input({
              message: "Enter the new name of the Folder.",
            });
            if (editFolderName.trim() === "") {
              console.log(
                chalk.red(
                  chalk.italic("\n \tPlease Enter the new name of the folder\n")
                )
              );
            } else {
              //find duplicate name of the folder
              let duplictFoldrName:FolderType|undefined = Folder.folder.find(
                (e) =>
                  e.name.toLowerCase().split(/\s+/).join("") ===
                  editFolderName.toLowerCase().split(/\s+/).join("")
              );
              if (duplictFoldrName?.name) {
                console.log(
                  chalk.red(
                    chalk.italic(
                      `\n \tFolder : ${chalk.cyanBright(
                        chalk.bold(editFolderName)
                      )} is already exist.\n`
                    )
                  )
                );
              } else {
                //update the folder detail
                findFoldrForEdit.name = editFolderName;
                findFoldrForEdit.path = `/path/${editFolderName}`;
                let mapFiles: FileType[] = findFoldrForEdit.files.map((e) => ({
                  name: e.name,
                  path: `${findFoldrForEdit.path}/${e.name}`,
                  type: e.type,
                  date: e.date,
                }));
                findFoldrForEdit.files = mapFiles;
              }
            }
          } else {
            console.log(
              chalk.red(
                chalk.italic(
                  `\n \tFolder : ${chalk.cyanBright(
                    chalk.bold(foldrName)
                  )} is not available.\n`
                )
              )
            );
          }
        }

        let moreEditFolder = await confirm({
          message: "Do you want to edit more Folder",
        });
        isCond = moreEditFolder;
      }
    }
  } else if (option === "Show Folder") {
    isCond = true;
    if (Folder.folder.length === 0) {
      Folder.folderEmpty();
    } else {
      while (isCond) {
        let searchFolder = await input({
          message: "Enter the name of the folder for show the folder",
        });
        if (searchFolder.trim() === "") {
          console.log(
            chalk.red(
              chalk.italic("\n \tPlease Enter thr name of the folder.\n")
            )
          );
        } else {
          let findFolderForShow:FolderType|undefined = Folder.folder.find(
            (e) =>
              e.name.toLowerCase().split(/\s+/).join("") ===
              searchFolder.toLowerCase().split(/\s+/).join("")
          );
          if (findFolderForShow) {
            let { name, path, files } = findFolderForShow;
            console.log(
              chalk.cyanBright(chalk.italic(`\n\t \t ### FOLDER ### \n`))
            );
            console.log(
              chalk.greenBright(
                chalk.italic(`\n \t### Folder : ${chalk.bold(name)} . ###\n`)
              )
            );
            console.log(
              chalk.greenBright(
                chalk.italic(
                  `\n \t### Folder Path : ${chalk.bold(path)} . ###\n`
                )
              )
            );
            console.log(
              chalk.cyanBright(chalk.italic(`\t \t ### FILES ### \n`))
            );
            console.log(chalk.cyanBright(`\t ---------------------\n`));
            if (files.length === 0) {
              console.log(
                chalk.cyanBright(
                  chalk.italic(` \t### FILES LIST IS EMPTY ###\n`)
                )
              );
              console.log(chalk.cyanBright(`\t ---------------------\n`));
            } else {
              files.forEach((e: FileType): void => {
                console.log(
                  chalk.greenBright(
                    chalk.italic(`\t FILE NAME : ${chalk.bold(e.name)} . \n`)
                  )
                );
                console.log(
                  chalk.greenBright(
                    chalk.italic(`\t FILE PATH : ${chalk.bold(e.path)} . \n`)
                  )
                );
                console.log(
                  chalk.greenBright(
                    chalk.italic(`\t FILE TYPE : ${chalk.bold(e.type)} . \n`)
                  )
                );
                console.log(
                  chalk.greenBright(
                    chalk.italic(
                      `\t FILE DATE : ${chalk.bold(
                        e.date.getDate()
                      )}-${chalk.bold(e.date.getMonth() + 1)}-${chalk.bold(
                        e.date.getFullYear()
                      )} . \n`
                    )
                  )
                );
                console.log(chalk.cyanBright(`\t ---------------------\n`));
              });
            }
          } else {
            console.log(
              chalk.red(
                chalk.italic(
                  `\n \t Folder : ${chalk.cyanBright(
                    chalk.bold(searchFolder)
                  )} is not available.\n`
                )
              )
            );
          }
        }
        let showMreFolder = await confirm({
          message: "Do you want to show again the folders.",
        });
        isCond = showMreFolder;
      }
    }
  } else if (option === "Move File") {
    isCond = true;
    if (Folder.folder.length === 0) {
      Folder.folderEmpty();
    } else {
      while (isCond) {
        //we want folder name for transfer the file of this folder
        let wantFolderForMoveFile = await input({
          message:
            "If You want to move files of folder into another folder , so please enter me the name of the folder.",
        });
        //check if input is empty
        if (wantFolderForMoveFile.trim() === "") {
          console.log(
            chalk.red(
              chalk.italic(`\n \t Please Enter the name of the folder. \n`)
            )
          );
        } else {
          //find the folder for transfer the files of this folder
          let findFolder:FolderType|undefined = Folder.folder.find(
            (e) =>
              e.name.toLowerCase().split(/\s+/).join("") ===
              wantFolderForMoveFile.toLowerCase().split(/\s+/).join("")
          );
          //if file was found
          if (findFolder?.name) {
            //we want another folder for transfer the files
            let foldrNameForTransferFiles = await input({
              message: "Enter the name of whose folder for transfer files",
            });
            //check if input is empty
            if (foldrNameForTransferFiles.trim() === "") {
              console.log(
                chalk.italic(
                  chalk.red(
                    "\n \t Please Enter the name of the folder for transfer file.\n"
                  )
                )
              );
            } else {
              //find folder for transfer files
              let findFoldrForTransferFile:FolderType|undefined = Folder.folder.find(
                (e) =>
                  e.name.toLowerCase().split(/\s+/).join("") ===
                  foldrNameForTransferFiles.toLowerCase().split(/\s+/).join("")
              );
              //if folder will be find
              if (findFoldrForTransferFile?.name) {
                //we want file name for transfer the file into another folder
                let moveFileInput = await input({
                  message:
                    "Enter the name of the file for transfer into another folder",
                });
                //check if input is emoty
                if (moveFileInput.trim() === "") {
                  console.log(
                    chalk.red(
                      chalk.italic(
                        "\n \t Please Enter the name of the file for move into another folder.\n"
                      )
                    )
                  );
                } else {
                  //destructuring of object
                  let { files } = findFoldrForTransferFile;
                  //find duplicate file in transfer folder
                  let duplictFiles:FileType|undefined = files.find(
                    (e) =>
                      e.name.toLowerCase().split(/\s+/).join("") ===
                      moveFileInput.toLowerCase().split(/\s+/).join("")
                  );
                  if (duplictFiles) {
                    //if file is already exist
                    console.log(
                      chalk.red(
                        chalk.italic(
                          `\n \t File : ${chalk.cyanBright(
                            chalk.bold(moveFileInput)
                          )} is already exist.\n`
                        )
                      )
                    );
                  } else {
                    //find file in those folder which transfer the file into another folder
                    let findFileForTransfer:FileType|undefined = findFolder.files.find(
                      (e) =>
                        e.name.toLowerCase().split(/\s+/).join("") ===
                        moveFileInput.toLowerCase().split(/\s+/).join("")
                    );
                    //if file was found
                    if (findFileForTransfer) {
                      //update the path of the file
                      findFileForTransfer.path = `/path/${foldrNameForTransferFiles}/${moveFileInput}`;
                      //transfer file into another folder
                      findFoldrForTransferFile.files.push(findFileForTransfer);
                      //remove transfer file in those folder who passes the file
                      let filtFiles = findFolder.files.filter((e) => {
                        return (
                          e.name.toLowerCase().split(/\s+/).join("") !==
                          moveFileInput.toLowerCase().split(/\s+/).join("")
                        );
                      });
                      //update those folder who passes the file
                      findFolder.files = filtFiles;
                    } else {
                      console.log(
                        chalk.red(
                          chalk.italic(
                            `\n \t File : ${chalk.cyanBright(
                              chalk.bold(moveFileInput)
                            )} is not available.\n`
                          )
                        )
                      );
                    }
                  }
                }
              } else {
                console.log(
                  chalk.italic(
                    chalk.red(
                      `\n \t Folder : ${chalk.cyanBright(
                        chalk.bold(foldrNameForTransferFiles)
                      )} is not available.\n`
                    )
                  )
                );
              }
            }
          } else {
            console.log(
              chalk.italic(
                chalk.red(
                  `\n \t Folder : ${chalk.cyanBright(
                    chalk.bold(wantFolderForMoveFile)
                  )} is not available.\n`
                )
              )
            );
          }
        }
        //Do you want to transfer more files
        let fileTransfrAgain = await confirm({
          message: "Do you want tranfer more files",
        });
        isCond = fileTransfrAgain;
      }
    }
  }
  //provide confirmation for run again this process
  let runAgain = await confirm({ message: "Do you want to run again." });
  isCond = runAgain;
}