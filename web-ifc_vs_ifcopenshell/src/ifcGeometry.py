import ifcopenshell
import ifcopenshell.geom
import multiprocessing
import pprint
import json
import pandas as pd
import time
settings = ifcopenshell.geom.settings()
columns=["Matrix","Faces","edges","verts"]
def run(filePath):
  before=time.time()
  file = ifcopenshell.open(filePath)
  iterator = ifcopenshell.geom.iterator(settings, file, multiprocessing.cpu_count())
  geometry=[]
  if iterator.initialize():
      while True:
          shape = iterator.get()
          matrix = shape.transformation.matrix.data
          faces = shape.geometry.faces
          edges = shape.geometry.edges
          verts = shape.geometry.verts
          materials = shape.geometry.materials
          material_ids = shape.geometry.material_ids
          geometry.append((shape.geometry.id,matrix,faces,edges,verts))
          # ... write code to process geometry here ...
          if not iterator.next():
              break
  print(pd.DataFrame(geometry))            
  print(f'Cpu count :{multiprocessing.cpu_count()}')            
  print(f'Time :{time.time()-before}s')            
run("./src/CenterConference.ifc")  