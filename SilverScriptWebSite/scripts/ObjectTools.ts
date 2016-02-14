///<reference path="FileTools.ts"/>
// Module
module SilverScriptTools {
    //Class
    export class ObjectTools {
        static CheckFileAPI(): boolean {
            // Check for the various File API support.
            if (window["File"] && window["FileReader"] && window["FileList"] && window["Blob"]
                && ObjectTools.supportsH264Video()) {
                // Great success! All the File APIs are supported.
                return true;
            }
            else {
                alert('The File APIs are not fully supported in this browser.');
                return false;
            }
        }

        static supportsH264Video(): boolean {
            var v = <HTMLVideoElement>document.createElement("video");
            var result = v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
            return result.length != 0;
        }

        static ConvertJsonToDate(sourceString: string): Date {
            var trimed = StringTools.TrimStart(sourceString, "/Date(");
            trimed = StringTools.TrimEnd(trimed, ")/");
            trimed = StringTools.TrimEnd(trimed, "+0000");

            return new Date(parseInt(trimed));
        }

        static ConvertJsonTimeSpanToDate(sourceString: string): Date //PT23H59M59S
        {
            var trimed = StringTools.TrimStart(sourceString, "PT");
            var hours: number = 0;
            var minutes: number = 0;
            var seconds: number = 0;

            var splitted = trimed.split("H");
            if (splitted.length > 1) {
                hours = parseInt(splitted[0]);
                trimed = splitted[1];
            }
            splitted = trimed.split("M");
            if (splitted.length > 1) {
                minutes = parseInt(splitted[0]);
                trimed = splitted[1];
            }
            trimed = StringTools.TrimEnd(trimed, "S");
            seconds = parseInt(trimed);
            return new Date(hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000);
        }


        static Any(list: Object[], condition: any): boolean {
            var currentIndex: number = 0;
            var currentItem: Object;
            do {
                currentItem = list[currentIndex];
                if (condition(currentItem) == true) {
                    return true;
                }
                currentIndex++;
            }
            while (currentItem != null);
            return false;
        }

        static Count(list: Object[], condition: any): number {
            var currentIndex: number = 0;
            var result: number = 0;
            var currentItem: Object;
            do {
                currentItem = list[currentIndex];
                if (condition(currentItem) == true) {
                    result++;
                }
                currentIndex++;
            }
            while (currentItem != null);
            return result;
        }

        static DeleteNode(node) {
            if (node) //make sure the node exists
            {
                ObjectTools.DeleteChildren(node); //delete node's children
                if (node.parentNode) //if the node has a parent
                {
                    node.parentNode.removeChild(node); //remove the node from the DOM tree
                }
                //delete node; //clean up just to be sure
            }
        }

        static DeleteChildren(node) {
            if (node) //make sure the node exists
            {
                for (var x = node.childNodes.length - 1; x >= 0; x--) //delete all of node's children
                {
                    var childNode = node.childNodes[x];
                    if (childNode.hasChildNodes()) //if the child node has children then delete them first
                    {
                        ObjectTools.DeleteChildren(childNode);
                    }
                    node.removeChild(childNode); //remove the child from the DOM tree
                   // delete childNode; //clean up just to be sure
                }
            }
        }
    }
}
