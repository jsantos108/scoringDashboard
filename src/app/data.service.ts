import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DataService {
  url = "https://eqh0i-3000.sse.codesandbox.io/locations";
  constructor(private http: HttpClient) {}
  getLocations() {
    return this.http.get(this.url);
  }
}
