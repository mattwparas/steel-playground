(define (any? x) #t)

(define/contract (level1)
    (->/c (->/c int?))
    (lambda () 10.2)) ;; this return value in the thunk results in a contract violation
                      ;; changing it to be 10 satisfies the contract

(define/contract (level2)
    (->/c (->/c number?))
    (level1))

(define/contract (level3)
    (->/c (->/c any?))
    (level2))

((level3))