class HttpResponse {
  static badRequest () {
    return { statusCode: 400 }
  }

  static serverError () {
    return { statusCode: 500 }
  }
}

module.exports = HttpResponse
