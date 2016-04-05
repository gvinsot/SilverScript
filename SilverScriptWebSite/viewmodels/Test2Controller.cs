﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SilverScript.viewmodels
{
    public class Test2Controller : ApiController
    {

        // GET: api/Test
        public IEnumerable<TestClass> Get()
        {
            
            List<TestClass> result = new List<TestClass>();
            for(int i=0;i<10;i++)
            {
                var person = new TestClass()
                {
                    FirstName = "Monsieur",
                    LastName = "Nom" + i,
                };
                int nbChildren = TestClass.rand.Next(7)+1;
                for(int j=0;j< nbChildren;j++)
                {
                    person.Children.Add(new TestClass()
                    {
                        LastName = "Nom"+i,
                        Age= TestClass.rand.Next(20)
                });
                }
                result.Add(person);
            }

            return result;
        }


        public class TestClass
        {
            public static Random rand = new Random();
            public string FirstName = "FirstName_" + Path.GetRandomFileName();
            public string LastName = "LastName_"+ Path.GetRandomFileName();
            public string Address = rand.Next(200)+"th " + Path.GetRandomFileName() + " street";
            public int Age = rand.Next(80)+20;
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
