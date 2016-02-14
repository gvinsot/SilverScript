using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SilverScript
{
    public partial class index : System.Web.UI.Page
    {
         
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        private static string _scripts = null;
        public string Scripts
        {
            get
            {
                if (_scripts == null)
                {
                    var currentDirectory = HttpContext.Current.Request.PhysicalApplicationPath;
                    var sb = new StringBuilder();
                    var files = Directory.GetFiles(currentDirectory, "*.js", SearchOption.AllDirectories).Where(el => el.EndsWith(".min.js") == false)
                                .Select(f => f.Replace(currentDirectory, "")).ToList();

                    #region orderScripts
                    var main = files.Where(el => el.Contains("app.js"));
                    var viewModels = files.Where(el => el.ToLower().Contains("viewmodel")).ToList();
                    var controls = files.Where(el => el.Contains("Controls")).ToList();
                    var interfaces = files.Where(el => el.Contains("Interface"));

                    //SendItemToBeginning("MediaStatic", viewModels);
                    //SendItemToBeginning("MediaDiffusion", viewModels);
                    //SendItemToBeginning("Base", controls);

                    var remaining = files.Except(viewModels)
                                         .Except(controls)
                                         .Except(interfaces)
                                         .Except(main);

                    AddScriptsElements(remaining, sb);
                    AddScriptsElements(interfaces, sb);
                    AddScriptsElements(controls, sb);
                    AddScriptsElements(viewModels, sb);
                    AddScriptsElements(main, sb);

                    #endregion orderScripts

                    _scripts = sb.ToString();
                }
                return _scripts;
            }
        }

        private void AddScriptsElements(IEnumerable<string> jsFiles, StringBuilder sb)
        {
            foreach (var file in jsFiles)
            {
                sb.AppendLine("\t<script type=\"text/javascript\" src=\"" + file + "\"></script>");
            }
        }

        private void SendItemToEnd(string pattern, List<string> list)
        {
            var item = list.FirstOrDefault(el => el.Contains(pattern));
            int index = list.IndexOf(item);
            list.Add(list[index]);
            list.RemoveAt(index);
        }
        private void SendItemToBeginning(string pattern, List<string> list)
        {
            var item = list.FirstOrDefault(el => el.Contains(pattern));
            int index = list.IndexOf(item);
            list.RemoveAt(index);
            list.Insert(0, item);
        }
    }
}