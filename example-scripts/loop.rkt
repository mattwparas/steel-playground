(define loop (lambda (x) (if (= x 10000) x (loop (+ x 1)))))

(loop 0)