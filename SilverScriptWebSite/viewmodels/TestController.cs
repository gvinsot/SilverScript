using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SilverScript.viewmodels
{
    public class TestController : ApiController
    {
        // GET: api/Test
        public IEnumerable<string> Get()
        {
            List<string> result = new List<string>();
            for(int i=0;i<1000;i++)
            {
                result.Add("Blabla_" + i + "_" + Path.GetRandomFileName());
            }

            return result;
        }

        public class TestClass
        {
            public string Name = "toto";
            public int Age = 99;
        }
        // GET: api/Test/5
        public TestClass Get(int id)
        {
            return new TestClass();
        }

        // POST: api/Test
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Test/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Test/5
        public void Delete(int id)
        {
        }
    }
}
