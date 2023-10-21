import * as WebIFC from "web-ifc"
import { Event } from "./Event";

export interface IIfcGeometry {
  expressID: number,
  matrix: number[],
  vertexData: Float32Array,
  indexData: Uint32Array,
  colID: string,
}

export class IfcLoader {


  private api: WebIFC.IfcAPI = new WebIFC.IfcAPI()
  private readonly wasmPath = "/";
  private readonly webIfcSettings = {
    COORDINATE_TO_ORIGIN: true,
    USE_FAST_BOOLS: true,
    OPTIMIZE_PROFILES: true,
    CIRCLE_SEGMENTS_LOW: 12,
    CIRCLE_SEGMENTS_MEDIUM: 24,
    CIRCLE_SEGMENTS_HIGH: 48,
    CIRCLE_SEGMENTS: 48,
    BOOL_ABORT_THRESHOLD: 10,
  };
  readonly onParser = new Event<any>();
  /**
   *
   */
  constructor() {
    this.api.SetWasmPath( this.wasmPath )
  }
  async parse( data: Uint8Array ) {
    try {
      // if ( this.api.wasmModule === undefined ) this.api.SetWasmPath( 'https://unpkg.com/web-ifc@0.0.44/' )
      await this.api.Init()
      const modelID = this.api.OpenModel( data, this.webIfcSettings )
      this.api.GetAndClearErrors( modelID )
      const geometries: IIfcGeometry[] = []
      this.api.StreamAllMeshesWithTypes( modelID, [WebIFC.IFCSPACE], ( mesh: WebIFC.FlatMesh ) => {
        this.streamMesh( modelID, mesh, geometries )
      } );
      this.api.StreamAllMeshes( modelID, ( mesh: WebIFC.FlatMesh ) => {
        this.streamMesh( modelID, mesh, geometries )
      } );
      this.onParser.trigger( geometries )
      this.api.CloseModel( modelID )
    } catch ( error ) {
      console.log( error );

    }
  }

  private streamMesh( modelID: number, mesh: WebIFC.FlatMesh, geometries: IIfcGeometry[] ) {
    const placedGeometries = mesh.geometries;
    const size = placedGeometries.size();
    for ( let i = 0; i < size; i++ ) {
      const placedGeometry = placedGeometries.get( i );
      const geometry = this.api.GetGeometry( modelID, placedGeometry.geometryExpressID ) as WebIFC.IfcGeometry;
      const color = placedGeometry.color
      const colID = `${color.x}-${color.y}-${color.z}-${color.w}`;
      geometries.push( {
        expressID: mesh.expressID,
        matrix: placedGeometry.flatTransformation,
        vertexData: this.api.GetVertexArray( geometry.GetVertexData(), geometry.GetVertexDataSize() ) as Float32Array,
        indexData: this.api.GetIndexArray( geometry.GetIndexData(), geometry.GetIndexDataSize() ) as Uint32Array,
        colID,
      } )
      //@ts-ignore
      geometry.delete();
    }
  }
}