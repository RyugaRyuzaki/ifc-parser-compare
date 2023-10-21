// See https://aka.ms/new-console-template for more information

using System;
using Xbim.Common.Geometry;
using Xbim.Ifc;
using Xbim.Ifc2x3;
using Xbim.Ifc4.Interfaces;
namespace MyApp // Note: actual namespace depends on the project name.
{
    internal class Program
    {
        static void Main(string[] args)
        {
            const string fileName = "CenterConference.ifc";
            var startTime = DateTime.Now;
            using (var model = IfcStore.Open(fileName))
            {
                // doc het cac geometry
                // Lấy tất cả các đối tượng có thông tin hình học
                var geometricElements = model.Instances.OfType<IIfcProduct>()
                    .Where(e => e.Representation != null && e.Representation.Representations.Any()).ToList();
                Console.WriteLine($"Geometry Count :{geometricElements.Count}");
               
            }
            var endTime = DateTime.Now;
            var executionTime = endTime - startTime;
            Console.WriteLine($"Total Execution Time: {executionTime.TotalMilliseconds/1000} s");
        }
    }
}