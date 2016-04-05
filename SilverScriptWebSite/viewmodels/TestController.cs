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
        public IEnumerable<TestClass> Get()
        {
            List<TestClass> result = new List<TestClass>();
            for(int i=0;i<250;i++)
            {
                result.Add(new TestClass());
            }

            return result;
        }

        public class TestClass
        {
            public static Random rand = new Random();
            public string FirstName = "FirstName_" + Path.GetRandomFileName();
            public string LastName = "LastName_" + Path.GetRandomFileName();
            public string Address = rand.Next(200) + "th " + Path.GetRandomFileName() + " street";
            public int Age = rand.Next(80) + 20;
            public List<TestClass> Children = new List<TestClass>();
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
    }
}
