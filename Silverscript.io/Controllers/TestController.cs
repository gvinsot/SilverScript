using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace SilverScript.viewmodels
{
    [Route("viewmodels")]
    public class TestController
    {
        [Route("TestLoad")]
        public IEnumerable<TestClass> LoadTest()
        {
            List<TestClass> result = new List<TestClass>();
            for(int i=0;i<250;i++)
            {
                result.Add(new TestClass());
            }

            return result;
        }

        [Route("Test1")]
        public TestClass UnitTest1()
        {
            return new TestClass()
            {
                FirstName = "Monsieur",
                LastName = "Tartampion",
            };
        }

        [Route("Test2")]
        public IEnumerable<TestClass> UnitTest2()
        {

            List<TestClass> result = new List<TestClass>();
            for (int i = 0; i < 10; i++)
            {
                var person = new TestClass()
                {
                    FirstName = "Mr",
                    LastName = "LastName" + i,
                };
                int nbChildren = TestClass.rand.Next(7) + 1;
                for (int j = 0; j < nbChildren; j++)
                {
                    person.Children.Add(new TestClass()
                    {
                        LastName = "LastName" + i,
                        FirstName = "FirstName"+j,
                        Age = TestClass.rand.Next(20)
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
            public string LastName = "LastName_" + Path.GetRandomFileName();
            public string Address = rand.Next(200) + "th " + Path.GetRandomFileName() + " street";
            public int Age = rand.Next(80) + 20;
            public List<TestClass> Children = new List<TestClass>();
        }
       
    }
}
