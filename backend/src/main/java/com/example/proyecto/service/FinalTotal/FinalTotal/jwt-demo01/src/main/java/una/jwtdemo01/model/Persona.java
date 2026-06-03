package una.jwtdemo01.model;

public class Persona {

    public Persona(long codigo, String cedula,String nombre) {
        Cedula = cedula;
        Codigo = codigo;
        Nombre = nombre;
    }


    public String getNombre() {
        return Nombre;
    }

    public void setNombre(String nombre) {
        Nombre = nombre;
    }

    public String getCedula() {
        return Cedula;
    }

    public void setCedula(String cedula) {
        Cedula = cedula;
    }

    public long getCodigo() {
        return Codigo;
    }

    public void setCodigo(long codigo) {
        Codigo = codigo;
    }

    public String Cedula;
    public String Nombre;

    public long Codigo;
}