import * as fs from "fs"
import { IfcLoader } from "./IfcLoader"
const ifcLoader = new IfcLoader()
export async function ReadIfc( fullPath: string ) {
  try {
    const before = performance.now()
    const data = new Uint8Array( fs.readFileSync( fullPath ) )

    ifcLoader.onParser.add( ( geometries: any[] ) => {
      console.log( `Geometries Length:${geometries.length}` );
      console.log( `Time :${( performance.now() - before ) / 1000}s` );
      ifcLoader.onParser.reset()
    } )
    await ifcLoader.parse( data )
  } catch ( error ) {
    console.log( error );
  }
}
ReadIfc( "./src/CenterConference.ifc" )