export type User = {
  Id: number;
  Email: string;
  Password: string;
};

export type UserClaim = {
  type: string,
  value: string;
}

export type UsuarioGet = {
  id: string,
  userName: string,
  email: string,
  perfilCompletado: boolean,
  recibirNotificaciones: boolean,
  estadoId: number,
  estado: string,
  sucursalId: number,
  sucursal: Sucursal | null,
  claims: UserClaim[]
}

export type UsuarioUpdate = {
  Email: string,
  SucursalId: number,
  EstadoId: number
}

export interface LoginConEmailI {
  Email: string,
  Password: string
};

export interface RegisterConEmail {
  Email: string,
  Password: string,
  SucursalId: number
};

export interface RecuperarForm {
  email: string;
}

export interface ResetPasswordForm {
  password: string;
  confirmarPassword: string;
}

export interface ReseteoPasswordIn {
  Email: string,
  Token: string,
  NuevoPassword: string
}

export interface ReseteoPasswordResponse {
  message: string,
  success: boolean
}

export interface CredencialesResetearPassword {
  Email: string;
  TokenResetPassword: string;
}


export type Product = {
  Id: number;
  Name: string;
  Price: number;
  Amount: number;
  Description: string;
  message?: string;
};

export type ProductPost = {
  name: string;
  price: number;
  amount: number;
  description: string;
};

export type Token = {
  token: string;
  error?: string;
}

export type ProductsPaginated = {
  Products: Product[];
  Total: number;
}

export type Categoria = {
  id: number,
  nombre: string,
  estado: string,
  estadoId: number
}

export type CategoriaCreacion = {
  IdEstado: number,
  Nombre: string
}

export type Inventario = {
  id: number,
  codigo: string,
  nombre: string,
  tipoProductoId: number,
  tipoProducto?: string,
  estadoId: number,
  estado: string,
  sucursalId: number,
  sucursal?: string,
  marca: string,
  precioCostoPromedio: number,
  precioVenta: number,
  urlFoto: string,
  descripcion: string,
  stock: number,
  unidadMedidaId: number,
  unidadMedida: string
}

export type InventarioCreacion = {
  Codigo: string,
  Nombre: string,
  TipoProductoId: number,
  EstadoId: number,
  Marca: string,
  Foto?: FileList,
  Descripcion?: string,
  UnidadMedidaId: number
}

export type TipoProducto = {
  id: number,
  nombre: string,
  estado: string,
  estadoId: number,
  categoria: string,
  categoriaId: number,
  tipoMedidaId: number,
  tipoMedida: string
}

export type Sucursal = {
  id: number,
  nombre: string,
  ubicacion: string,
  estado: string,
  estadoId: number
}

export type SucursalCreacion = {
  Nombre: string,
  Ubicacion: string,
  EstadoId: number
}

export type Carrito = {
  id: number,
  idUser: string
}

export type CarritoDetails = {
  id: number,
  carritoId: number,
  inventarioId: number,
  cantidad: number,
  subTotal: number,
  fecha: string,
  hasConflict: boolean,
  inventario: Inventario
}

export type CarritoDetCreacion = {
  InventarioId: number,
  Cantidad: number
}

export type DetalleUpdateResult = {
  success: boolean
}

export type TipoMedida = {
  id: number,
  nombre: string
}

export type TipoProductoCreacion = {
  Nombre: string,
  EstadoId: number,
  CategoriaId: number,
  TipoMedidaId: number
}

export type Proveedor = {
  id: number,
  nit: string,
  nombres: string,
  apellidos: string,
  telefono: string,
  ubicacion: string,
  estadoId: number,
  estado: string
}

export type BestProveedor = {
  id: number,
  nit: string,
  nombres: string,
  apellidos: string,
  telefono: string,
  cantidadCompras: number
}

export type ProveedorCreacion = {
  Nit: string,
  Nombres: string,
  Apellidos: string,
  Telefono: string,
  Ubicacion: string,
  EstadoId: number
}

export type ProveedorCreacionNit = {
  Nit: string
}

export type DetalleCompra = {
  id: number,
  compraId: number,
  inventarioId: number,
  inventario: Inventario,
  estadoId: number,
  estado: string,
  unidadMedidaId: number,
  unidadMedida: string,
  cantidad: number,
  unidadesPorCaja: number,
  precioCosto: number,
  fecha: string
}

export type DetalleCompraCreacion = {
  CompraId: number,
  InventarioId: number | undefined,
  EstadoId: number,
  UnidadMedidaId: number,
  UnidadesPorCaja: number | null,
  Cantidad: number,
  PrecioCosto: number
}

export type Compra = {
  id: number,
  proveedor: Proveedor,
  userId: string,
  emailUser: string,
  detallesCompra: DetalleCompra[],
  sucursalId: number,
  sucursal: string,
  estadoId: number,
  estado: string,
  total: number,
  fechaCreacion: string
}

export type CompraDelDia = {
  id: number,
  proveedorId: number,
  nitProveedor: string,
  proveedor: string,
  sucursal: string,
  total: number,
  fechaCreacion: string
}

export type CompraCreacion = {
  ProveedorNit: string,
  Total: number | undefined
}

export type CompraCreacionResp = {
  id: number
}

export type CompraUpdate = {
  NitProveedor: string
}

export type UnidadMedida = {
  id: number,
  medida: string,
  abreviatura: string,
  tipoMedidaId: number,
  tipoMedida: string
}

export type Cliente = {
  id: number,
  nit: string,
  nombres: string,
  apellidos: string,
  email: string | null,
  telefono: string,
  fechaRegistro: string,
}

export type BestCliente = {
  id: number,
  nit: string,
  nombres: string,
  apellidos: string,
  email: string | null,
  telefono: string,
  cantidadVentas: number,
  totalGastado: number
}

export type ClienteCreacion = {
  Nit: string,
  Nombres: string,
  Apellidos: string,
  Email?: string,
  Telefono: string
}

export type ClienteCreacionNit = {
  Nit: string
}

export type Venta = {
  id: number,
  userId: string,
  emailUser: string,
  clienteId: number,
  cliente: Cliente,
  detallesVenta: DetalleCompra[],
  sucursalId: number,
  sucursal: string,
  estadoId: number,
  estado: string,
  total: number,
  fechaCreacion: string
}

export type VentaDelDia = {
  id: number,
  clienteId: number,
  nitCliente: string,
  cliente: string,
  sucursal: string,
  total: number,
  fechaCreacion: string
}

export type VentaCreacion = {
  ClienteNit: string,
  Total: number
}

export type VentaUpdate = {
  NitCliente: string
}

export type VentaCreacionResp = {
  id: number
}

export type VentaPago = {
  Pago: number
}

export type respVuelto = {
  vuelto: number
}

export type DetalleVenta = {
  id: number,
  ventaId: number,
  inventarioId: number,
  inventario: Inventario,
  estadoId: number,
  estado: string,
  unidadMedidaId: number,
  unidadMedida: string,
  cantidad: number,
  unidadesPorCaja: number,
  precioVenta: number,
  descuento: number,
  total: number,
  precioVentaConDescuento: number,
  fecha: string
}

export type DetalleVentaCreacion = {
  VentaId: number,
  InventarioId: number | undefined,
  EstadoId: number,
  UnidadMedidaId: number,
  UnidadesPorCaja: number | null,
  Cantidad: number,
  PrecioVenta: number,
  Descuento: number,
  PrecioVentaConDescuento: number,
  Total: number
}

export type Descuento = {
  descuento: number
}