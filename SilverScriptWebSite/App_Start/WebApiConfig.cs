using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace SilverScript
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "viewmodels/{controller}/{id}",
                defaults: new { controller = "Test", action = "Get", id = RouteParameter.Optional }
            );

        }
    }
}
